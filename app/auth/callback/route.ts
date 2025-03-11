
// Commented out for 'guest mode'
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(request: NextRequest) {
//   try {
//     const requestUrl = new URL(request.url);
//     const code = requestUrl.searchParams.get('code');
    
//     if (code) {
//       const cookieStore = cookies();
//       const supabase = createRouteHandlerClient({ 
//         cookies: () => cookieStore 
//       });
      
//       await supabase.auth.exchangeCodeForSession(code);
//     }
    
//     // URL to redirect to after sign in process completes
//     return NextResponse.redirect(requestUrl.origin);
//   } catch (error) {
//     console.error("Error in auth callback:", error);
//     return NextResponse.redirect(`${new URL(request.url).origin}/auth-error`);
//   }
// }
