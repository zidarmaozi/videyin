import { Link } from 'react-router-dom';

function TopNav() {
  return (
    <div className="top">
      <div className="logo">
        <Link to="/">videy</Link>
      </div>
      <Link to="/">
        <div className="upload">Upload</div>
      </Link>

    </div>
  );
}

export default TopNav;
