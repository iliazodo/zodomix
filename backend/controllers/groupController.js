import Group from "../models/groupModel.js";

export const createGroup = async (req , res) => {
    try {
        const {name , picture , description , pass} = req.body;

        if(pass !== "zodomix33all"){
            return res.status(403).json({error: "YOU HAVE NOT ACCESS"});
        }

        if(!name){
            return res.status(400).json({error:"NAME NEEDED"});
        }

        if(await Group.findOne({name})){
            return res.status(400).json({error: "TRY DIFFERENT NAME"});
        }

        const newGroup = new Group({
            name,
            picture,
            description
        })

        await newGroup.save();

        res.status(201).json({
            name: newGroup.name,
            picture: newGroup.picture,
            description: newGroup.description
        })

    } catch (error) {
        console.log("ERROR IN GROUPCOTROLLER: " , error.message);
        res.status(500).json({error:"INTERNAL SERVER ERROR"});
    }
}

export const getGroup = async (req ,res) => {
    try {
        const groups = await Group.find();
        
        res.status(200).json(groups);

    } catch (error) {
        console.log("ERROR IN GROUPCOTROLLER: " , error.message);
        res.status(500).json({error:"INTERNAL SERVER ERROR"});
    }
}