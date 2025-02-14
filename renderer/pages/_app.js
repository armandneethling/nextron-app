import { AnimatePresence } from 'framer-motion'
import '../styles/global.css'

function MyApp({ Component, pageProps, router }) {
    return (
        <AnimatePresence exitBeforeEnter>
            <Component {...pageProps} key={router.route}/>
        </AnimatePresence>
    ) 
}

export default MyApp