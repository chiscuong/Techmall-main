// middleware.js - Đơn giản nhất có thể
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware((auth, request) => {
  // Tạm thời log để debug
  console.log('🔍 Middleware called for:', request.url)
  console.log('🔍 Auth in middleware:', auth())
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}