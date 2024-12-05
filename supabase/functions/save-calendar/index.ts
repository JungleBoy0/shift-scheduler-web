import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, filename } = await req.json()
    
    // Create calendars directory if it doesn't exist
    try {
      await Deno.mkdir('/var/www/scheludes/dist/calendars', { recursive: true })
    } catch (error) {
      console.error('Error creating directory:', error)
    }

    // Write the file
    const filePath = `/var/www/scheludes/dist/calendars/${filename}`
    await Deno.writeTextFile(filePath, content)

    console.log(`Calendar file saved successfully at ${filePath}`)

    return new Response(
      JSON.stringify({ success: true, filePath }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error saving calendar:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})