// node src/utils/CreateUser.js --email=sample1@gmail.com --password=password123

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jehxchqyswfjjicxzbyl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplaHhjaHF5c3dmamppY3h6YnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NjE2MDMsImV4cCI6MjAzMjQzNzYwM30.rGuYkxg8vV_QSC9irqfX5TC3pcVcASr2dMOa5jge1hw';

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL and/or Supabase Key not provided in environment variables.'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      confirmation_sent_at: new Date().toISOString()
    });

    if (error || !data) {
      console.error('Error creating user:', error);
      return;
    }

    const user = data.user;

    if (!user) {
      console.error('No user data found after signup.');
      return;
    }

    console.log('User created successfully:', user);

    const { error: dbError } = await supabase.from('users').insert([
      {
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]);

    if (dbError) {
      console.error('Error saving user to database:', dbError);
    } else {
      console.log('User saved to database successfully.');
    }
  } catch (error) {
    console.error('Error during user creation:', error);
  }
}

const args = process.argv.slice(2);
const email = args[0].split('=')[1];
const password = args[1].split('=')[1];
createUser(email, password);
