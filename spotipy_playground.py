import time
import pandas as pd
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException

# --- Credentials ---
CLIENT_ID = '973a74bd05994ff4814cb955265f579f'
CLIENT_SECRET = '082fb2f1d26a4bec8d86cef69efec7e6'
REDIRECT_URI = 'https://example.com/callback'  # Use this for Spotify app settings

def diagnostic_test():
    """
    Run comprehensive diagnostics using user authentication
    """
    print("=" * 60)
    print("SPOTIFY API DIAGNOSTIC TEST (User Authentication)")
    print("=" * 60)
    
    # Test 1: User Authentication
    print("\n1. Testing User Authentication...")
    try:
        # Use Authorization Code Flow instead of Client Credentials
        auth = SpotifyOAuth(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=REDIRECT_URI,
            scope="user-read-private user-read-email",  # Basic scopes
            cache_path=".spotify_cache"  # Cache token locally
        )
        
        sp = Spotify(auth_manager=auth)
        
        # This will open browser for first-time authentication
        user_info = sp.current_user()
        print(f"✓ Authentication successful")
        print(f"Logged in as: {user_info['display_name']} ({user_info['email']})")
        
    except Exception as e:
        print(f"✗ Authentication failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure https://example.com/callback is added to your Spotify app's Redirect URIs")
        print("2. Go to: https://developer.spotify.com/dashboard")
        print("3. Click your app > Settings > Redirect URIs > Add 'https://example.com/callback'")
        return
    
    # Test 2: Basic Search (should always work)
    print("\n2. Testing Basic Search...")
    try:
        results = sp.search(q='artist:Ski Mask the Slump God', type='artist', limit=1)
        artist = results['artists']['items'][0]
        print(f"✓ Search successful: Found '{artist['name']}'")
        artist_id = artist['id']
    except Exception as e:
        print(f"✗ Search failed: {e}")
        return
    
    # Test 3: Get some popular tracks to test with
    print("\n3. Getting Popular Tracks...")
    try:
        top_tracks = sp.artist_top_tracks(artist_id, country='US')
        if top_tracks['tracks']:
            test_tracks = top_tracks['tracks'][:3]
            print(f"✓ Got {len(test_tracks)} top tracks:")
            for track in test_tracks:
                print(f"  - {track['name']} (ID: {track['id']})")
        else:
            print("✗ No top tracks found")
            return
    except Exception as e:
        print(f"✗ Failed to get top tracks: {e}")
        return
    
    # Test 4: Test Audio Features (should work now!)
    print("\n4. Testing Audio Features with User Auth...")
    
    track_ids = [track['id'] for track in test_tracks]
    
    try:
        features = sp.audio_features(track_ids)
        if features and any(f is not None for f in features):
            successful = sum(1 for f in features if f is not None)
            print(f"✓ SUCCESS! Got audio features for {successful}/{len(track_ids)} tracks")
            
            # Show sample features
            for i, (track, feature) in enumerate(zip(test_tracks, features)):
                if feature:
                    print(f"\n  Track {i+1}: {track['name']}")
                    print(f"    Danceability: {feature.get('danceability', 'N/A')}")
                    print(f"    Energy: {feature.get('energy', 'N/A')}")
                    print(f"    Tempo: {feature.get('tempo', 'N/A')}")
                    print(f"    Valence: {feature.get('valence', 'N/A')}")
        else:
            print("✗ No features returned")
    except SpotifyException as e:
        print(f"✗ SpotifyException: {e}")
        print(f"   HTTP Status: {getattr(e, 'http_status', 'unknown')}")
        if getattr(e, 'http_status', None) == 403:
            print("   Still getting 403 - check app permissions in developer dashboard")
    except Exception as e:
        print(f"✗ Other error: {e}")
    
    # Test 5: Test with well-known track
    print("\n5. Testing with Well-Known Track...")
    popular_track_id = '4iV5W9uYEdYUVa79Axb7Rh'  # Never Gonna Give You Up
    
    try:
        features = sp.audio_features([popular_track_id])
        if features and features[0]:
            print("✓ Popular track audio features work!")
            f = features[0]
            print(f"   Danceability: {f.get('danceability')}")
            print(f"   Energy: {f.get('energy')}")
            print(f"   Tempo: {f.get('tempo')}")
        else:
            print("✗ Popular track failed")
    except Exception as e:
        print(f"✗ Popular track error: {e}")
    
    print("\n" + "=" * 60)
    print("DIAGNOSTIC COMPLETE")
    print("=" * 60)

# Alternative: Simpler authentication setup
def simple_setup():
    """
    Simple setup function that handles the authentication flow
    """
    print("Setting up Spotify authentication...")
    
    auth = SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=REDIRECT_URI,
        scope="user-read-private user-read-email",
        cache_path=".spotify_cache",
        open_browser=True  # Automatically opens browser
    )
    
    sp = Spotify(auth_manager=auth)
    
    # Test the connection
    try:
        user = sp.current_user()
        print(f"✓ Connected as: {user['display_name']} ({user.get('email', 'no email')})")
        
        # Test audio features
        test_track = '4iV5W9uYEdYUVa79Axb7Rh'
        features = sp.audio_features([test_track])
        if features and features[0]:
            print("✓ Audio features working!")
            return sp
        else:
            print("✗ Audio features still not working")
            return None
            
    except Exception as e:
        print(f"✗ Setup failed: {e}")
        return None

if __name__ == '__main__':
    # Run the diagnostic
    diagnostic_test()
    
    # Or use the simple setup
    # sp = simple_setup()
    # if sp:
    #     print("Ready to use audio features!")