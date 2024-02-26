// Scripts: Utility Functions
/*----------------------------------------------------------------------------------------------------*/

/*---------- Styles ----------*/

// Function - classNames
export const classNames = (...args: any[]): string => {
	return args
		.filter((arg) => arg && typeof arg == 'string' && arg !== '')
		.join(' ');
};

/*---------- Array ----------*/

export function arShuffle(array: any[]) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

/*---------- String ----------*/

// Function - strRemoveTags
export const strRemoveTags = (str: string) => {
	if (str == null || str == '') return false;
	else str = str.toString();
	return str.replace(/(<([^>]+)>)/gi, '').replace(/&#x27;/, "'");
};

// Function - strRemoveDuplicates
export const strRemoveDuplicates = (str: string[]) => {
	return str.filter((item, index) => str.indexOf(item) === index);
};

// Function - strGetInitials
export const strGetInitials = (str: string) => {
	return str.split(' ').map((word: string) => word[0]);
};

// Function - strCapitalize
export const strCapitalize = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function - strGenerateUid
export const strGenerateUid = () => {
	return `${new Date().getTime()}-${Math.floor(Math.random() * 10000000000)}`;
};

/*---------- Number ----------*/

// Function - numPad
export const numPad = (num: number, size: number) => {
	let numStr = num.toString();
	while (numStr.length < size) numStr = '0' + numStr;
	return numStr;
};

// Function - numOrdinalOf
export function numOrdinalOf(num: number) {
	return (
		num +
		(num > 0
			? ['th', 'st', 'nd', 'rd'][
					(num > 3 && num < 21) || num % 10 > 3 ? 0 : num % 10
			  ]
			: '')
	);
}

// Function - numDecimalToPrice
export const numDecimalToPrice = (num: number) => {
	return (num / 100).toFixed(2).toString();
};
