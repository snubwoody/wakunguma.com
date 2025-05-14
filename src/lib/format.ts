import dayjs from "dayjs";
// FIXME this import breaks the client
export const formatDate = (value: string) => {
    const date = dayjs(value).format("MMMM DD, YYYY");
    return date;
};
