const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/enviar-lead', async (req, res) => {
  const { name, phone } = req.body;

  const payload = {
    stream_code: "qrw5o",
    client: {
      name,
      phone
    }
  };

  try {
    const response = await fetch("https://api.drcash.sh/v2/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DRCASH_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || "Erro ao enviar o lead." });
    }

    res.status(200).json({ message: "Lead enviado com sucesso!" });

  } catch (error) {
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
