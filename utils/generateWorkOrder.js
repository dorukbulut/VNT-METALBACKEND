import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";

let GenerateWorkOrder = async (data, template_name) => {
  // Load the docx file as binary content
  let file_name = `${template_name}_${data.company}.docx`;
  const content = fs.readFileSync(
    path.resolve("./templates/workorder", file_name),
    "binary"
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
  doc.render(data);

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
  });

  // buf is a nodejs Buffer, you can either write it to a
  // file or res.send it with express for example.
  fs.writeFileSync(path.resolve("./files", "output3.docx"), buf);
  return buf;
};

export default GenerateWorkOrder;
