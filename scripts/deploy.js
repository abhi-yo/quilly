const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // QuillyToken not needed for copyright protection - skipping deployment

  console.log("\n🛡️ Deploying CopyrightProtection...");
  const CopyrightProtection = await ethers.getContractFactory(
    "CopyrightProtection"
  );
  const copyrightProtection = await CopyrightProtection.deploy();
  await copyrightProtection.waitForDeployment();
  const copyrightAddress = await copyrightProtection.getAddress();
  console.log("✅ CopyrightProtection deployed to:", copyrightAddress);

  console.log("\n🔧 Contract addresses:");
  console.log("COPYRIGHT_PROTECTION_ADDRESS=", copyrightAddress);

  console.log("\n📋 Environment variables for .env.local:");
  console.log(`NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS=${copyrightAddress}`);

  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
