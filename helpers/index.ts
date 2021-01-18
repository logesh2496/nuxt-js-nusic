export const _groupBy = (items: object[], keyName: string) => {
    const groupedObj: any = {};
    items.map((item: any) => {
        const key = item[keyName];
        if(groupedObj[key]) {
            groupedObj[key].push(item);
        } else {
            groupedObj[key] = [item];
        }
    });
    return groupedObj;
}