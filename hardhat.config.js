require('@nomiclabs/hardhat-waffle')
const {
  promises: { writeFile }
} = require('fs')
const path = require('path')
const prettier = require('prettier')
const { ZkIdentity, Strategy } = require('@zk-kit/identity')

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

task('ids', 'Generate Semaphore ID commitments')
  .addParam('message', 'the message to sign')
  .setAction(async ({ message }) => {
    const accounts = await hre.ethers.getSigners()
    const identities = await Promise.all(
      accounts.slice(0, 3).map(async (account) => {
        const signedMessage = await account.signMessage(message)
        const identity = new ZkIdentity(Strategy.MESSAGE, signedMessage)
        return identity.genIdentityCommitment().toString()
      })
    )

    await writeFile(
      path.join(__dirname, 'static', 'identityCommitments.json'),
      prettier.format(JSON.stringify(identities), { parser: 'json' })
    )
  })
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.4'
}
