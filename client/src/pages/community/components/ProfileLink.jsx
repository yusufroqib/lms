import React from "react";
import { Link } from "react-router-dom";

const ProfileLink = ({ imgUrl, href, title }) => {
    return (
        <div className="flex-center gap-1">
            <img src={imgUrl} alt="icon" width={20} height={20} />
            {href ? (
                <Link to={href} target="_blank" className="paragraph-medium text-blue-500">
                    {title}
                </Link>
            ) : (
                <p className="paragraph-medium text-dark400_light700">{title}</p>
            )}
        </div>
    );
};

export default ProfileLink;
