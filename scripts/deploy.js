const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  console.log("\n🪙 Deploying QuillyToken...");
  const QuillyToken = await ethers.getContractFactory("QuillyToken");
  const quillyToken = await QuillyToken.deploy();
  await quillyToken.waitForDeployment();
  const quillyTokenAddress = await quillyToken.getAddress();
  console.log("✅ QuillyToken deployed to:", quillyTokenAddress);

  console.log("\n🛡️ Deploying CopyrightProtection...");
  const CopyrightProtection = await ethers.getContractFactory("CopyrightProtection");
  const copyrightProtection = await CopyrightProtection.deploy();
  await copyrightProtection.waitForDeployment();
  const copyrightAddress = await copyrightProtection.getAddress();
  console.log("✅ CopyrightProtection deployed to:", copyrightAddress);

  console.log("\n🏛️ Deploying DAOGovernance...");
  const DAOGovernance = await ethers.getContractFactory("DAOGovernance");
  const daoGovernance = await DAOGovernance.deploy(quillyTokenAddress);
  await daoGovernance.waitForDeployment();
  const daoAddress = await daoGovernance.getAddress();
  console.log("✅ DAOGovernance deployed to:", daoAddress);

  console.log("\n🔧 Contract addresses:");
  console.log("QUILLY_TOKEN_ADDRESS=", quillyTokenAddress);
  console.log("COPYRIGHT_PROTECTION_ADDRESS=", copyrightAddress);
  console.log("DAO_GOVERNANCE_ADDRESS=", daoAddress);

  console.log("\n📋 Environment variables for .env.local:");
  console.log(`NEXT_PUBLIC_QUILLY_TOKEN_ADDRESS=${quillyTokenAddress}`);
  console.log(`NEXT_PUBLIC_COPYRIGHT_PROTECTION_ADDRESS=${copyrightAddress}`);
  console.log(`NEXT_PUBLIC_DAO_GOVERNANCE_ADDRESS=${daoAddress}`);

  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 