import { NextFunction, Response,Request } from "express";
import { Product, IProduct} from "../models/product";
import { User, UserModel } from "../models/user";
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import { validationResult} from 'express-validator'
// import Mailjet from 'node-mailjet';

// import mailjetTransport from 'nodemailer-mailjet-transport';
const mailjetTransport =require('nodemailer-mailjet-transport');


const secretKey = '2888c71a59472469d5376954c3ae3b2d';
const apiKey = '1dc62fd4963108f98f96c2bb9cd91fca';

// const mailjet = Mailjet.apiConnect(apiKey,secretKey)
const transporter = nodemailer.createTransport(
    mailjetTransport({
        auth: {
            apiKey:apiKey,
            apiSecret:secretKey,
        }
    })
)

// const transport = nodemailer.createTransport({
//     host: 'smtp.mailtrap.io',
//     port: 2525,
//     auth: {
//     user: '4a878018893eaf',
//     pass: '6270c68ba276f4',
//   },
// })
export const getLogin = (req: Request, res: Response, next: NextFunction) => {
    // const isLoggedIn = req.get('Cookie')?.split('loggedIn')[1].trim().split('=')[1];
    
    let message: string | undefined | string[] = req.flash('error')
    message = message.length > 0 ? message[0] : undefined
    
    res.render('auth/login', {
    pageTitle: 'login',
    path: '/login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
    });
}
export const getSignup = (req: Request, res: Response, next: NextFunction) => {
    const date = new Date(Date.now())
    console.log(date);
    
    let message: string | undefined | string[] = req.flash('error')
    message = message.length > 0 ? message[0] : undefined
    res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
    });
}
export const postLogin = (req: Request, res: Response, next: NextFunction) => {
    User.findByEmail(req.body.email)
    .then(user => {
        
        if(!user){
            
            req.flash('error','Invalid E-Mail or password')
            return res.redirect('/login')
        }
        bcryptjs.compare(req.body.password,user.password)
        .then(doMatch => {
            console.log('doMatch',doMatch);
            
            if(doMatch){
                req.session.user = user
                req.session.isLoggedIn= true;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            req.flash('error', 'Invalid E-Mail or password')
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login')
        })
        
  }).catch(err => console.log(err))
    
}
export const postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.session.destroy(()=>{
        res.redirect('/')
    })
    
}
export const postSignup = (req: Request, res: Response, next: NextFunction) => {
    const {email, password, confirmPassword} = req.body
    User.findByEmail(email)
    .then(async user => {
        if(user){
            req.flash('error', 'E-Mail exists already ')
            return res.redirect('/signup');
        } else if(!validationResult(req).isEmpty()){
           return res.status(422).render('auth/signup', {
                pageTitle: 'Signup',
                path: '/signup',
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: validationResult(req).array()[0].msg
                });
        }
        const hashedPassword = await bcryptjs.hash(password,12);  
        const newUser = new User(hashedPassword,email,{items:[]})
        return newUser.save()
    })
    .then(async result => {
        if(result){
            res.redirect('/login');
            sendMailNode(email, 'Signup succeeded','You successfully signed up')
            .then(result => {
                // console.log('Email sent:', result.body);
                
            }).catch(err => {
                console.error('Error sending email:', err);
            });
            // await transport.sendMail({
            //     from: 'shop@node-complete.com',
            //     to: email,
            //     subject: 'Signup succeeded',
            //     text: 'You successfully signed up',
            //   })
        }
    })
    .catch(err => console.log(err))
}

export const getReset = (req: Request, res: Response, next: NextFunction) => {
    let message: string | undefined | string[] = req.flash('error')
    message = message.length > 0 ? message[0] : undefined
    res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
    });
}
export const postReset = (req: Request, res: Response, next: NextFunction) => {
   crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findByEmail(req.body.email)
        .then(async user => {
            if(!user){
                req.flash('error', 'no account found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration =  new Date(Date.now() + 3600000);
            return user.save()
        })
        .then(async result => {
            res.redirect('/');
            await sendMailNode(
                req.body.email,
                'Password reset',
                ` <p>You requested a password reset</p>
                Click this <a href="http://localhost:3000/reset${token}">link</a> to set a new password
                `)
        })
        .catch(err => console.log(err))
   })
    
}
export const getUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
    let message: string | undefined | string[] = req.flash('error')
    message = message.length > 0 ? message[0] : undefined
    const token = req.params.token;
    User.findByToken(token)
    .then(user => {
        if(user){
            console.log(token);
            
            res.render('auth/update-password', {
                pageTitle: 'Reset Password',
                path: '/reset',
                isAuthenticated: req.session.isLoggedIn,
                errorMessage: message,
                userId: user._id.toString(),
                token: token
                });
        } else {
            // req.flash('error', 'not valid');
            res.redirect('/');
        }
    })
    .catch(err => {
        console.log(err);
    })
    
}
export const postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
    const { newPassword, userId, token } = req.body;
    User.findByToken(token, userId).
    then( async user => {
        if(user){
            const hashedPassword = await bcryptjs.hash(newPassword,12);
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save()
        }
    })
    .then(user => {
        res.redirect('/login')
    })
    .catch(err => console.log(err));
     
 }

const sendMailNode = async (email:string,subject:string,htmlPart:string,) => {
    try {
        const info = await transporter.sendMail({
          from: {
            name: 'Khalid',
            address: 'k.waleed@viscircle.com',
          },
          to: email,
          subject: subject,
          html: htmlPart,
        });
    
        console.log('Email sent: ' + info.response);
      } catch (error) {
        console.error('Error sending email: ' + error);
      }

}
// const sendMailJet = (email:string,subject:string,textPart:string,) => {
//     return mailjet.post('send',{version: 'v3.1'}).request({
//         Messages: [
//             {
//               From: {
//                 // Email: 'foo456860@gmail.com',
//                 Email: 'k.waleed@viscircle.com',
//                 Name: 'Khalid',
//               },
//               To: [
//                 {
//                   Email: email,
//                 },
//               ],
//               Subject: subject,
//               TextPart: textPart,
//             },
//           ],
//     })
// }