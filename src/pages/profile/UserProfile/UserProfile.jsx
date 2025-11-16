import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const resolveUserId = () => {
      if (user?.id) return user.id;
      if (user?._id) return user._id;

      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed?._id || parsed?.id || null;
        }
      } catch (e) {
        // ignore parse errors
      }

      return localStorage.getItem('userId') || null;
    };

    const fetchProfile = async (id) => {
      if (!id) return setError('User id not available.');

      const token = localStorage.getItem('token');
      if (!token) return setError('Not authenticated.');

      setLoading(true);
      setError(null);

      const base = import.meta.env.VITE_BACK_END_SERVER_URL || '';

      try {
        const res = await fetch(`${base}/users/${id}`, {
          method: 'GET',
          signal: controller.signal,
          headers: token
            ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
            : { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          // try parse server message, fall back to status
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.message || `Request failed: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'Failed to load profile.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const id = resolveUserId();
    fetchProfile(id);

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [user]);

  // No retry handler — keep component simple and deterministic

  // Helper to safely get count of an array-like field
  const getCount = (field) => {
    if (Array.isArray(field)) return field.length;
    if (typeof field === 'number') return field;
    return field ? 1 : 0;
  };

  // Count booked travels from different possible shapes returned by backend.
  // Backend may return `bookings` array where each booking has an `event` (id or populated object).
  const getBookedCount = (profileObj) => {
    if (!profileObj) return 0;

    // prefer explicit bookedTravels field if present
    if (Array.isArray(profileObj.bookedTravels)) return profileObj.bookedTravels.length;

    // otherwise try bookings: collect unique event ids
    if (Array.isArray(profileObj.bookings)) {
      const ids = profileObj.bookings
        .map((b) => {
          if (!b) return null;
          // booking.event might be an id or an object
          if (typeof b.event === 'string') return b.event;
          if (b.event && (b.event._id || b.event.id)) return b.event._id || b.event.id;
          return null;
        })
        .filter(Boolean);

      // unique
      return Array.from(new Set(ids)).length;
    }

    return 0;
  };

  if (loading) {
    return (
      <div>
        <h2>Profile</h2>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Profile</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h2>Profile</h2>
        <p>No profile available.</p>
        <button type="button" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Profile</h2>
      
      <div>
        <p><strong>ID:</strong> {profile._id || profile.id || 'N/A'}</p>
        <p><strong>Username:</strong> {profile.username || 'N/A'}</p>
        <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
        <p><strong>Email:</strong> {profile.email || 'N/A'}</p>
        <p><strong>Phone:</strong> {profile.phone || 'N/A'}</p>
        <p><strong>Role:</strong> {profile.role || 'N/A'}</p>

        {profile.role === 'customer' && (
          <>
            <p><strong>Favourites:</strong> {getCount(profile.favourites)}</p>
            <p><strong>Booked Travels:</strong> {getBookedCount(profile)}</p>
          </>
        )}
      </div>

      <div>
        <button type="button" onClick={() => navigate('/edit-profile')}>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;