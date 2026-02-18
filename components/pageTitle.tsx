type PageTitleProps = {
  children: React.ReactNode;
};

const PageTitle = ({ children }: PageTitleProps) => {
  return (
    <h1>
      <a 
        href="/" 
        style={{ 
          color: "#e0e0e0", 
          textDecoration: "none",
          transition: "opacity 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        {children}
      </a>
    </h1>
  );
};

export default PageTitle;
