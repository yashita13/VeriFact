'use server';

import {auth, db} from "@/firebase/admin";
import { cookies } from "next/headers";

// Types used by actions
export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

const ONE_WEEK=60*60*24*7;

export async function signUp(params: SignUpParams){
    const {uid, name, email }=params;

    try{
        const userRecord=await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success: false,
                message: 'User already exists. Please sign in instead.'
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return{
            success: true,
            message: 'Account created successfully. Please sign in.'
        }

    }catch(e:any){
        console.error('Error creating a user', e);

        if(e.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: 'Email already in use.'
            }
        }

        return{
            success: false,
            message: 'Failed to create an account.'
        }
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try{
        const userRecord=await auth.getUserByEmail(email);

        if(!userRecord){
            return{
                success: false,
                message: 'User does not exist. Please sign up instead.'
            }
        }

        await setSessionCookie(idToken);
        return { success: true };

    }catch(e){
        console.error('Error signing in', e);
        return {
            success: false,
            message: 'Failed to sign in.'
        }
    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore=await cookies();

    const sessionCookie=await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK*1000,    // 1 week * 1000ms
    })

    cookieStore.set('session', sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        path:'/',
        sameSite:'lax',
    })
}

export async function getCurrentUser(): Promise<User | null>{
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // Try to read the Firestore user profile. If Firestore isn't initialized (NOT_FOUND)
        // or the document doesn't exist yet, fall back to Auth claims so the app can proceed.
        try {
            const snap = await db
                .collection('users')
                .doc(decodedClaims.uid)
                .get();

            if (snap.exists) {
                return {
                    ...(snap.data() as any),
                    id: snap.id,
                } as User;
            }
        } catch (err: any) {
            console.warn('[getCurrentUser] Firestore read failed; falling back to Auth claims. Ensure Firestore is created in Firebase Console.', err?.code || err);
        }

        // Fallback: build a minimal user from the verified token claims
        const email = (decodedClaims as any)?.email || '';
        const name = (decodedClaims as any)?.name || (email ? email.split('@')[0] : 'User');
        return { id: decodedClaims.uid, name, email } as User;

    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user=await getCurrentUser();
    return !!user;  // if user='' => !!''  !!false  !true  false
}
