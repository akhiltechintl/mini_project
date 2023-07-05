const peopleModel = require("../Models/People");
const portfolioModel = require("../Models/Portfolio");
const taskModel = require("../Models/Task");


//Adding People To DB
exports.addPeople = async (req, res) => {
    try {
        console.log("called add People");

        const people = {
            name, isActive, email, phone, address, accesslevel, jobInfo, createdByID
        } = req.body;

        // Generate unique portfolioId
        const peopleId = await generatePeopleId();
        people.peopleId = peopleId;


        const save = await peopleModel.create(people);

        res.status(200).json({"Message": "Saved Successfully", "Data": save});
    } catch (error) {
        res.status(400).json({"message": error.message});
    }
};

//Function To Generate PeopleId
async function generatePeopleId() {
    const lastPeopleid = await peopleModel.findOne({}, {}, {sort: {peopleId: -1}});

    if (lastPeopleid) {
        const lastId = lastPeopleid.peopleId
        const newId = (parseInt(lastId) + 1).toString().padStart(4, "0");
        return newId;
    }

    return "0001";
}

//API To Get-All People
exports.getPeople = async (req, res) => {
    try {

        const getAll = await peopleModel.find();
        return res.status(200).json({"data": getAll})
    } catch (error) {
        return res.status(400).json({error: error});
    }
};

exports.listPeople = async (req, res) => {
    try {
        console.log('called get all people to html');

        const people = await peopleModel.find();


        res.render('people', { people }); // Render the people.ejs template with the people data


        // res.status(200).json({people});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

//api to update people
exports.updatePeople = async (req, res) => {
    const peopleId = req.body.peopleId;
    console.log("peopleId", peopleId);
    if (!peopleId) {
        return res.status(200).json({"message": "People Id is null"});
    }

    try {
        const update = await peopleModel.updateOne({peopleId: peopleId}, {$set: req.body}, {new: true, upsert: false});

        if (update.modifiedCount > 0 && update.matchedCount > 0) {
            return res.status(200).json({"message": "People Updated Successfully","data":update});
        } else {
            return res.status(200).json({"message": "No Record Found"});
        }

    } catch (error) {
        return res.status(400).json({"error": error.message});
    }
};

//Api to list the users with access level User
exports.getAssignee = async (req, res) => {
    try {
        const users = await peopleModel.find({accesslevel: 'User'}).select('name peopleId');
        return res.status(200).json({message: 'successfully fetched users', users: users});
    } catch (err) {
        console.error('Failed to fetch users:', err);
        return res.status(400).json({message: err.message});
    }
};

//api to delete user by passing user id as parameter
exports.deletePeople = async (req, res) => {
    const peopleId = req.params.peopleId;
    console.log(peopleId)
    if (!peopleId) {
        console.log("not exists")
        return res.status(200).json({message: "People Id is Required"});
    }

    try {
        console.log(" exists")
        const result = await peopleModel.deleteOne({peopleId: peopleId});
        if (result.deletedCount === 1) {
            return res.status(200).json({"message": "Person deleted"});
        }
        if (result.deletedCount === 0) {
            return res.status(200).json({"message": "Id doesn't match"});
        }
    } catch (err) {
        return res.status(400).json({"error": err.message});
    }
}

exports.multiplePeopleDelete = async (req, res) => {
    try {
        const deleted=[];
        const notDeleted=[];
        const {peopleIds}  = req.body;
        // const length  = req.body.peopleIds.length;
        console.log("length : ",peopleIds)
        console.log("port : ",peopleIds)
        // Delete tasks matching the given task IDs
        for(let i=0; i<peopleIds.length; i++) {
            const result = await peopleModel.deleteOne({peopleId: peopleIds[i]});

            if(result.deletedCount===1){
                console.log(i ,"th position, deleted :", peopleIds[i]);
                deleted.push(peopleIds[i]);
            }
            else if(result.deletedCount===0){
                console.log(i ,"th position ,not deleted :", peopleIds[i]);
                notDeleted.push( peopleIds[i]);
                console.log("not deleted :", notDeleted[i]);
            }
        }
        if (notDeleted.length===0) {
            res.status(200).json({
                message: 'people deleted successfully.'
            });
        } else {
            console.log("nottt ",notDeleted)
            res.status(400).json({
                message: 'Some people not found in the database.',
                missingTaskIds: notDeleted,
                deleted:deleted
            });

        } }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting people.' });
    }
};

exports.getPeopleList= async (req, res) => {
    try {
        // Fetch projects from the database (assuming you're using Mongoose)
        const peoples = await peopleModel.find();
        console.log("table:",peoples)

        // Render the project.ejs file with the projects data
        res.render('people', { peoples });
    } catch (error) {
        // Handle error appropriately
        res.status(400).send(error.message);
    }
};

exports.listAll= async (req, res) => {
    const { page , limit } = req.body;
    console.log("page and limit")
    console.log(page, limit)
    if(!page || !limit){
        return res.status(200).json({message:"page and limit not found"})
    }
    console.log("page ",page," ",limit)
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const people = await peopleModel.paginate({}, options);

        return res.status(200).json({"data":people});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
}