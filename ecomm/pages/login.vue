<template>
    <div>
        <h1 class="text-bold text-center text-xl border-4 border-blue-300">This is login Page</h1>
        <div class=' text-center h-16 text-white '>
            <button class="bg-blue-500 w-[80%] h-[60%] mt-3 rounded-lg" @click="signInWithGoogle">Sign In with
                Google</button>
        </div>
    </div>
</template>

<script setup>
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const auth = useFirebaseAuth()
const router = useRouter()

function signInWithGoogle() {
    signInWithPopup(auth, new GoogleAuthProvider()).then(() => router.replace('/'))

}
</script>

<style></style>