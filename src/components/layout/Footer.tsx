import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background py-6 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            &copy; {new Date().getFullYear()} Alumni Nexus. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-rajasthan-blue hover:underline mr-4">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-rajasthan-blue hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
