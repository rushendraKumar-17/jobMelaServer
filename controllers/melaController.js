import melaModel from "../models/melaModel.js";

const getReport = async(req,res)=>{
 const {id} = req.params;
 try{
    const mela = await melaModel.findByPk(id);
    if(!mela){
        return res.status(404).json({message:"Mela not found"});
    }
    res.status(200).json({applications:mela.applications,companies:mela.companies,vacancies:mela.vacancies,selectedCandidates:mela.selectedCandidates});
 }catch(error){
    res.status(500).json({message:"Error fetching mela",error});
 }
}
const getMela=async(req,res)=>{
    const {id} = req.params;
    try{
        const mela = await melaModel.findByPk(id);
        if(!mela){
            return res.status(404).json({message:"Mela not found"});
        }
        res.status(200).json(mela);
    }catch(error){
        res.status(500).json({message:"Error fetching mela",error});
    }
}
const create = async(req,res)=>{
    try{
        const {name,description,startDate,endDate,location,area} = req.body;
        // console.log(req.body)
        if(!name  || !startDate || !endDate || !location){
            return res.status(400).json({message:"All fields are mandatory"});
        }
        const mela = await melaModel.create({name,description,startDate,endDate,location,area});
        res.status(200).json({message:"Mela created successfully",mela});
    }catch(error){
        console.log(error)
        res.status(500).json({message:"Error creating mela",error});
    }
}
export default {getReport,create,getMela};