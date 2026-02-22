import React from "react";
import ContentLoader from "react-content-loader";

const MessageSkeleton = () => (
  <div className="flex gap-4 mb-6 w-full">
    <div className="w-full max-w-3xl">
      <ContentLoader
        speed={2}
        width="100%"
        height={110}
        viewBox="0 0 800 110"
        backgroundColor="#1f1f1f"
        foregroundColor="#333"
        className="w-full"
      >
        {/* avatar */}
        <circle cx="40" cy="55" r="30" />

        {/* username */}
        <rect x="90" y="15" rx="6" ry="6" width="140" height="12" />

        {/* time */}
        <rect x="240" y="15" rx="6" ry="6" width="80" height="12" />

        {/* message bubble */}
        <rect x="90" y="35" rx="20" ry="20" width="60%" height="45" />
      </ContentLoader>
    </div>
  </div>
);

export default MessageSkeleton;