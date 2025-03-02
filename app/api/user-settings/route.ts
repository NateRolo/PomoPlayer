import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create the Supabase client with the correct pattern for Next.js 14+
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("No session found");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log("Session found for user:", session.user.id);
    
    // For now, just return a success response for testing
    return NextResponse.json({ 
      success: true, 
      userId: session.user.id,
      email: session.user.email
    });
  } catch (error) {
    console.error("Error in user-settings API route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create the Supabase client with the correct pattern for Next.js 14+
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    });
    
    // Get the session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the request body
    const body = await request.json();
    
    // For now, just return a success response for testing
    return NextResponse.json({ 
      success: true, 
      userId: session.user.id,
      receivedData: body
    });
  } catch (error) {
    console.error("Error in user-settings API route:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
