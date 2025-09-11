// middleware.js - Đơn giản nhất có thể
import { clerkMiddleware } from '@clerk/nextjs/server'

<<<<<<< HEAD
export default clerkMiddleware(async(auth, request) => {
  const authData = await auth()
  // Tạm thời log để debug
  console.log('🔍 Middleware called for:', request.url)
  console.log('🔍 Auth in middleware:', authData)
  // Bạn có thể kiểm tra luôn nếu cần:
  if (!authData.userId) {
    console.log("❌ Chưa đăng nhập")
  } else {
    console.log("✅ User ID:", authData.userId)
  }

})

=======
export default clerkMiddleware((auth, request) => {
  // Tạm thời log để debug
  console.log('🔍 Middleware called for:', request.url)
  console.log('🔍 Auth in middleware:', auth())
})
>>>>>>> 7229a53716edf37d8dbe4c2f36237be3a0ea9108

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}