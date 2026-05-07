import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ 
        fontSize: '8rem', 
        margin: '0', 
        color: '#b0b1ad',
        fontWeight: '900',
        lineHeight: '1'
      }}>
        404
      </h1>
      
      <h2 style={{ 
        fontSize: '2rem', 
        color: '#636e72', 
        marginBottom: '15px' 
      }}>
        Opps! Page Not Found
      </h2>
      
      <p style={{ 
        fontSize: '1.1rem', 
        color: '#b2bec3', 
        maxWidth: '400px', 
        marginBottom: '30px',
        lineHeight: '1.6'
      }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link href="/" style={{
        padding: '12px 30px',
        backgroundColor: '#ea5211',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'background 0.3s ease',
        boxShadow: '0 4px 14px 0 rgba(242, 104, 19, 0.39)'
      }}>
        Back to Home
      </Link>
    </div>
  );
}