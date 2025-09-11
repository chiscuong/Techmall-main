// middleware.js - Đơn giản nhất có thể
import { clerkMiddleware } from '@clerk/nextjs/server'

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
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}