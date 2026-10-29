import mongoose, {Schema} from 'mongoose';

import moongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudinary url
            required: true
        },

        thumbnail: {
            type: String, // cloudinary url
            required: true
        },  

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        duration: {
            type: Number, // cloudinary url
            required: true
        },

        views: {
            type: Number,
            default: 0
        },

        isPublished: {
            type: Boolean,
            default: false
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
)

// to understand this go to moongoose 
videoSchema.plugin(moongooseAggregatePaginate) 
export const Video = mongoose.model("Video", videoSchema)