// app.js

// Form 1: Add and Notarize NFT
document.getElementById("notarizeForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const nftId = document.getElementById("nftIdAdd").value;
  const email = document.getElementById("emailAdd").value;

  try {
    const client = await tlsn.connect(); // Connect to TLSNotary
    console.log('Connected to TLSNotary for notarization');

    const proofData = await client.notarize(
      `https://api.example.com/nft/${nftId}/add`, // Example add API endpoint
      {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    document.getElementById("notarizeResult").innerHTML = `
      <h3>Notarization Successful!</h3>
      <p><strong>NFT ID:</strong> ${nftId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Session:</strong> ${JSON.stringify(proofData.session)}</p>
    `;
  } catch (error) {
    if (error.message === "user rejected") {
      document.getElementById("notarizeResult").innerHTML = `
        <h3>Notarization Rejected</h3>
        <p>User canceled the operation.</p>
      `;
    } else {
      console.error('Error during notarization:', error);
      document.getElementById("notarizeResult").innerHTML = `
        <h3>Error during notarization</h3>
        <p>Something went wrong. Please try again later.</p>
      `;
    }
  }
});

// Form 2: Verify NFT
document.getElementById("verifyForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const nftId = document.getElementById("nftIdVerify").value;
  const email = document.getElementById("emailVerify").value;

  try {
    const response = await fetch(`https://api.example.com/nft/${nftId}/verify`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      const result = await response.json();
      document.getElementById("verifyResult").innerHTML = `
        <h3>Verification Successful!</h3>
        <p><strong>NFT ID:</strong> ${nftId}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Status:</strong> ${result.status}</p>
      `;
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error('Error verifying NFT:', error);
    document.getElementById("verifyResult").innerHTML = `
      <h3>Error during verification</h3>
      <p>Something went wrong. Please try again later.</p>
    `;
  }
});
