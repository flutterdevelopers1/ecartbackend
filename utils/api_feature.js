export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    pagination() {
        const PAGE_LIMIT = 3;
        let PAGE_NUMBER = this.queryString.page * 1 || 1;
        if (this.queryString.page <= 0) PAGE_NUMBER = 1;
        const PAGE_SKIP = (PAGE_NUMBER - 1) * PAGE_LIMIT;

        this.mongooseQuery.skip(PAGE_SKIP).limit(PAGE_LIMIT);
        return this;
    }

    filteration() {
        let filterObj = { ...this.queryString };

        let excludedQuery = ["page", "sort", "fields", "keyword"];

        excludedQuery.forEach((ele) => {
            delete filterObj[ele];
        });
        filterObj = JSON.stringify(filterObj);

        filterObj = filterObj.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );
        filterObj = JSON.parse(filterObj);

        this.mongooseQuery.find(filterObj);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            let sortedBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery.sort(sortedBy);
        }
        return this;
    }

    search() {
        if (this.queryString.keyword) {

            this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.queryString.keyword, $options: "i" } },
                    { descripton: { $regex: this.queryString.keyword, $options: "i" } },
                ],
            });
        }
        return this;
    }


    fields() {
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(",").join(" ");
            console.log(fields);
        }
        return this;
    }
}