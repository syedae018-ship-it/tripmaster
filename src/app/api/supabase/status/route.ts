import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasSecretKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !hasPublishableKey || !hasSecretKey) {
      return NextResponse.json(
        {
          status: "misconfigured",
          message: "Supabase environment variables are missing",
          config: {
            supabaseUrl,
            hasPublishableKey,
            hasSecretKey,
          },
        },
        { status: 500 }
      );
    }

    // Ping Supabase Storage API using the service role admin client
    const { data: buckets, error: storageError } = await supabaseAdmin.storage.listBuckets();

    if (storageError) {
      return NextResponse.json(
        {
          status: "connected_with_warning",
          message: "Connected to Supabase endpoint, but storage check returned an error",
          error: storageError.message,
          projectUrl: supabaseUrl,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "connected",
      message: "Supabase client connected successfully",
      projectUrl: supabaseUrl,
      bucketsCount: buckets?.length || 0,
      buckets: buckets?.map((b) => b.name) || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}

