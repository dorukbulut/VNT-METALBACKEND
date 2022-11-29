import Analyze from "../models/analyze.model.js";

export const createAnalyse = async(req, res) => {
    

    try {
        const new_analyse = {...req.body};

        let  _ = await Analyze.Create(new_analyse.analyze);

        res.status(200).json({message : "Analyze Created"})
    }

    catch(err) {
        res.status(500).json({ message: "An error occured." });
    }


}

export const updateAnalyze = async(req, res) => {
    try{
        const analyse = {...req.body};

        if (await Analyze.FindOne({where : {
            analyze_id : analyse.analyze_id
        }})) {
            let retval = await Analyze.Update(analyse.analyze,{where : {
                analyse_id : analyse.analyze.id
            }} )

            res.status(200).json({ message: "Analyze Updated"});

        } else {
            res.status(401).json({ message: "Cannot find analyze" });
        }
    }

    catch(err) {
        res.status(500).json({ message: "An error occurred." });
    }
}

export const getAnalyse = async(req, res) => {
    const q = { ...req.body };

  try {
    const analyze = await Analyze.findAll({
      where: {
        analyze_id: q.analyze_id,
      }
    });

    if (customer.length !== 0) {
      res.status(200).json({ analyze });
    } else {
      res.status(401).json({ message: "Cannot find any analyze" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
  }
}

export const getAllAnalyze = async (req, res) => {
    try {
        const analyzes = await Analyze.findAll();
        if (customers !== 0) {
          res.status(200).json({ analyzes });
        } else {
          res.status(401).json({ message: "No Analyze found in database" });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occured" });
      }
}

export const deleteAnalyze = async(req, res) => {
    const cus = { ...req.body };
  try {
    const row = await Analyze.findOne({
      where: { analyze_id: cus.analyze_id },
    });
    if (row) {
        let retval = await TaxInfo.destroy({
            where: {
                analyze_id: cus.analyze_id,
            },
            force: true,
          });
      res.status(200).json({ message: "Analyze Deleted." });
    } else {
      res.status(401).json({ message: "Cannot find analyze !" });
    }
  } catch (err) {
    console.log(err);
    res.send(500).json({ message: "An error ocurred" });
  }
}





export default {createAnalyse, updateAnalyze, getAllAnalyze, getAnalyse, deleteAnalyze}