export const getEventStartDate = (event: any) => {
    return event.date || event.startDate || '';
};

export const getEventEndDate = (event: any) => {
    return event.endDate || event.date || event.startDate || '';
};

export const parseEventDate = (dateString: string) => {
    if (!dateString) return null;

    const cleanDate = dateString.trim();

    // Format: 2026-06-27
    const isoMatch = cleanDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        const year = Number(isoMatch[1]);
        const month = Number(isoMatch[2]) - 1;
        const day = Number(isoMatch[3]);

        return new Date(year, month, day);
    }

    // Format: 27.06.2026, 27.06. oder Sa, 27.06. / 20:00
    const swissMatch = cleanDate.match(/(\d{1,2})\.(\d{1,2})\.?(\d{4})?/);
    if (swissMatch) {
        const day = Number(swissMatch[1]);
        const month = Number(swissMatch[2]) - 1;
        const year = swissMatch[3]
            ? Number(swissMatch[3])
            : new Date().getFullYear();

        return new Date(year, month, day);
    }

    return null;
};

export const startOfDay = (date: Date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
};

export const hasEventFinished = (event: any) => {
    const endDate = getEventEndDate(event);
    const parsedEndDate = parseEventDate(endDate);

    if (!parsedEndDate) return false;

    const today = startOfDay(new Date());
    const eventEndDay = startOfDay(parsedEndDate);

    return eventEndDay < today;
};

export const isEventVisibleInNormalPages = (event: any) => {
    return !hasEventFinished(event);
};

export const isEventVisibleInWeekly = (event: any) => {
    const startDate = getEventStartDate(event);
    const parsedStartDate = parseEventDate(startDate);

    if (!parsedStartDate) return false;

    const today = startOfDay(new Date());
    const eventStartDay = startOfDay(parsedStartDate);

    const weeklyEndDay = new Date(eventStartDay);
    weeklyEndDay.setDate(eventStartDay.getDate() + 7);
    weeklyEndDay.setHours(23, 59, 59, 999);

    return eventStartDay < today && today <= weeklyEndDay;
};

export const isWeeklyVoteExpired = (event: any) => {
    const startDate = getEventStartDate(event);
    const parsedStartDate = parseEventDate(startDate);

    if (!parsedStartDate) return false;

    const today = startOfDay(new Date());
    const eventStartDay = startOfDay(parsedStartDate);

    const weeklyEndDay = new Date(eventStartDay);
    weeklyEndDay.setDate(eventStartDay.getDate() + 7);
    weeklyEndDay.setHours(23, 59, 59, 999);

    return today > weeklyEndDay;
};