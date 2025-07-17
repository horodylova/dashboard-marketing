"use client";

const SocialMediaCard = ({ icon, accountName, followers, likes, views }) => {
  return (
    <div className="k-d-flex k-flex-col k-col-span-md-2 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
        <div className="k-d-flex">
          {icon}
        </div>
        <div className="k-font-size-lg k-font-weight-bold">
          {accountName}
        </div>
      </div>
      <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
        <div>{followers} followers</div>
        <div>{likes} likes</div>
        <div>{views} views</div>
      </div>
    </div>
  );
};

export default SocialMediaCard;