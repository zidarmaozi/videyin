function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="copyright">
        Copyright &copy; <span>{currentYear}</span> TRUE DOMAIN PRIVACY, LLC
      </div>
      <div className="legal">
        <div className="item">
          <a href="/terms-of-service">Terms of Service</a>
        </div>
        <div className="item">
          <a href="/report" id="reportAbuse">Report Abuse</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
