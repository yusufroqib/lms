const BADGE_CRITERIA = {
    POST_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    REPLY_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    POST_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    REPLY_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    TOTAL_VIEWS: {
        BRONZE: 1000,
        SILVER: 10000,
        GOLD: 100000,
    },
};


module.exports = assignBadges = (params) => {
    // console.log(params)
	const badgeCounts = {
		GOLD: 0,
		SILVER: 0,
		BRONZE: 0,
	};
	const { criteria } = params;
	criteria.forEach((item) => {
		const { type, count } = item;
		const badgeLevels = BADGE_CRITERIA[type];
		Object.keys(badgeLevels).forEach((level) => {
			if (count >= badgeLevels[level]) {
				badgeCounts[level] += 1;
			}
		});
	});
	return badgeCounts;
};
