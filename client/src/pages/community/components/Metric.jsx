import React from "react";
import { Link } from "react-router-dom";

const Metric = ({ imgUrl, alt, value, title, href, isAuthor, textStyles }) => {
    const metricContent = (
        <>
            <img src={imgUrl} width={16} height={16} alt={alt} className={`object-contain ${href ? "rounded-full" : ""}`} />
            <p className={`${textStyles} flex items-center gap-1`}>
                {value}
                <span className={`small-regular line-clamp-1 ${isAuthor ? "max-sm:hidden" : ""}`}>
                    {title}
                </span>
            </p>
        </>
    );
    if (href) {
        return (
            <Link to={href} className="flex-center gap-1">
                {metricContent}
            </Link>
        );
    }
    return <div className="flex-center flex-wrap gap-1">{metricContent}</div>;
};

export default Metric;
