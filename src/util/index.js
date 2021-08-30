export const prepare = (o) => {
    if (o) {
        o._id = o._id.toString();
        o.id = o._id.toString();
        console.log(o.id);
        console.log(o._id);
    }
    return o;
};
