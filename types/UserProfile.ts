export interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  profile_image_url: string | null;
  background_image_url: string | null;
  created_at: string;
  last_login_at: string;
} 
