import fs from 'fs';

const form = new FormData();
form.append('file', new Blob([fs.readFileSync('./assignment.pdf')]), 'assignment.pdf');

const res = await fetch('http://localhost:3000/ingest', {
  method: 'POST',
  body: form,
});

console.log(await res.json());