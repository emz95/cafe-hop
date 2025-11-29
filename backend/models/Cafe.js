const {Schema, model, Types} = require("mongoose");

const cafeSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true 
    },
    avgRating: {
        type: Number, 
        default: 0
    },
    reviewCount: {
        type: Number, 
        default: 0
    }

})

cafeSchema.statics.calcAvgRating = async function (cafeId) {
    const CafeReview = this.model("CafeReview");

    const stats = await CafeReview.aggregate([
        { $match: { cafe: cafeId } },
        {
            $group: {
                _id: "$cafe",
                avgRating: { $avg: "$rating" },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await this.findByIdAndUpdate(cafeId, {
            avgRating: stats[0].avgRating,
            reviewCount: stats[0].reviewCount
        });
    } else {
        await this.findByIdAndUpdate(cafeId, {
            avgRating: 0,
            reviewCount: 0
        });
    }
};


module.exports = model('Cafe', cafeSchema);