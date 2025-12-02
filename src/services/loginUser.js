/* "Without a doubt I know what the controllers and models are used for. However, I am able to write code that interacts with my db, for example adding users to a table, on either the controller or model. At what times should I write code in the controller vs. in model? (...)
Code to access the database should be in service layer instead of keeping in Controller or Model. (...)
ASP.NET MVC and MVC, in general, is a presentation layer pattern; thus your interaction with the database should be in a layer beyond the presentation layer, usually a data-access layer, but it could be a service layer or business layer as well."
https://stackoverflow.com/questions/18282795/when-should-i-write-code-in-the-controller-vs-model */

import { prisma } from '../../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* 'secret-key' is a fallback, to make sure that there is a string and to avoid an error if there is no key in the .env file */
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const loginUser = async (email, password) => {
    console.log({email, password});

    // 1. Find bruger i databasen
    const user = await prisma.user.findUnique({
        /* If the user is not active, it won't be returned. This way, it is not necessary to delete the user and all of his/her info. */
        where: { email, isActive: true },
        select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            password: true,
            role: true
        }
    });
    console.log(user);
    
    if (!user) {
        throw new Error('Bruger findes ikke');
    };

    // 2. Sammenlign password med det hash’ede password (password is the one coming in, and user.password is in the db)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
        /* This is not a smart message to give to a user because it tells a potential criminal where the mistake is, 
        but this is what we are doing today. */
        throw new Error('Forkert password');
    };

    // 3. Lav en token (JWT)
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            fullname: `${user.firstname} ${user.lastname}`,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '1h' } // token udløber efter 1 time
    );
    console.log(token);

    // 4. Returnér bruger + token (uden password)
    const { password: _password, ...userWithoutPassword } = user; // password: _password  represents the value to exclude from user (const defined above)
    console.log(userWithoutPassword); //Returns user, excluding his/her password.

    return {
        user: userWithoutPassword,
        token
    };
};
