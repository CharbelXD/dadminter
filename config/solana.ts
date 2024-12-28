import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

import { TokenMetadata,pack } from "@solana/spl-token-metadata";
import { createInitializeMintInstruction } from "@solana/spl-token";
const decimal = 6; // You can change this based on your token's needs
const connection = new web3.Connection('https://api.devnet.solana.com', 'confirmed');
const TOKEN_2022_PROGRAM_ID = token.TOKEN_2022_PROGRAM_ID;
const ASSOCIATED_TOKEN_PROGRAM_ID = token.ASSOCIATED_TOKEN_PROGRAM_ID;

interface MetadataForm{
    name: string;
    symbol: string;
    description: string;
}

export async function createMint(
    { name, symbol,description }: MetadataForm,
    wallet: any,
    uri: string|null,
    keypair = web3.Keypair.generate(),
    confirmOptions?: web3.ConfirmOptions,
): Promise<void> {

    if (!wallet.publicKey || !wallet.signTransaction) {
        alert('Please connect your wallet first');
        return;
    }
    const mintKeypair = web3.Keypair.generate();

    const metadata:TokenMetadata = {
        name,
        symbol,
        uri: uri || "",
        mint: mintKeypair.publicKey,
        additionalMetadata:[
            ['description', description],
        ],
    };



    try {
        // Generate a new keypair for the mint account

        // Get minimum lamports needed for rent exemption
  const mintSpace = token.getMintLen([token.ExtensionType.MetadataPointer]);
  const metadataLen = token.TYPE_SIZE + token.LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintSpace + metadataLen
  );
  const createAccountIx= web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: mintSpace,
      lamports,
      programId: TOKEN_2022_PROGRAM_ID,
  })
  const initializeMetadataPointerIx = token.createInitializeMetadataPointerInstruction(
                mintKeypair.publicKey,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID
              )
                   // Initialize mint instruction
        const initializeMintIx = createInitializeMintInstruction(
            mintKeypair.publicKey,
            decimal,
            wallet.publicKey,
            wallet.publicKey,
            TOKEN_2022_PROGRAM_ID
        );
        const initializeMetadataIx=token.createInitializeInstruction({
            mint: mintKeypair.publicKey,
            metadata: mintKeypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: wallet.publicKey,
            updateAuthority: wallet.publicKey,
            programId: TOKEN_2022_PROGRAM_ID,

          })
          const updateMetadataIx = token.createUpdateFieldInstruction({
            metadata: mintKeypair.publicKey,
            updateAuthority: wallet.publicKey,
            field: metadata.additionalMetadata[0][0],
            value: metadata.additionalMetadata[0][1],
            programId: TOKEN_2022_PROGRAM_ID
          })


    
        // Create transaction for token creation
        const transaction = new web3.Transaction().add(
            createAccountIx,
            initializeMetadataPointerIx,

            initializeMintIx,
            initializeMetadataIx,
            updateMetadataIx
        );
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (
          await connection.getLatestBlockhash()
        ).blockhash;
        transaction.partialSign(mintKeypair);
        const signature = await wallet.sendTransaction(transaction, connection);

        // Confirm transaction
        await connection.confirmTransaction(signature, 'confirmed');

        alert(`Token created! Mint address: ${mintKeypair.publicKey.toBase58()}`);
        console.log(`Token created! Mint address: ${mintKeypair.publicKey.toBase58()}`);
    } catch (error) {
        console.error('Error creating token:', error);
    }
}
const mint = new web3.PublicKey("9JDXurJB6DR18giBSfWZez6U5E5mYZnPPgfozwBpLmgt");
// 9JDXurJB6DR18giBSfWZez6U5E5mYZnPPgfozwBpLmgt
// Ezm398KUqD1t8rL5BdnUPomgEJ4cJnSFw9nB8V3KUhDW
export async function getOrCreateAssociatedTokenAccount(
    wallet: any,
    owner: web3.PublicKey,
    allowOwnerOffCurve = false,
    commitment?: web3.Commitment,
    confirmOptions?: web3.ConfirmOptions,
    programId = TOKEN_2022_PROGRAM_ID,
    associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID,
): Promise<token.Account> {
    const associatedToken = token.getAssociatedTokenAddressSync(
        mint,
        owner,
        allowOwnerOffCurve,
        programId,
        associatedTokenProgramId,
    );

    // This is the optimal logic, considering TX fee, client-side computation, RPC roundtrips and guaranteed idempotent.
    // Sadly we can't do this atomically.
    let account: token.Account;
    try {
        account = await token.getAccount(connection, associatedToken, commitment, programId);
        console.log('Account:', account);
    } catch (error: unknown) {
        // TokenAccountNotFoundError can be possible if the associated address has already received some lamports,
        // becoming a system account. Assuming program derived addressing is safe, this is the only case for the
        // TokenInvalidAccountOwnerError in this code path.
        if (error instanceof token.TokenAccountNotFoundError || error instanceof token.TokenInvalidAccountOwnerError) {
            // As this isn't atomic, it's possible others can create associated accounts meanwhile.
            try {
                const transaction = new web3.Transaction().add(
                    token.createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        associatedToken,
                        owner,
                        mint,
                        programId,
                        associatedTokenProgramId,
                    ),
                );

                transaction.feePayer = owner;
                transaction.recentBlockhash = (
                    await connection.getLatestBlockhash()
                ).blockhash;


                // Sign transaction
                const signature = await wallet.sendTransaction(transaction, connection);
                console.log('Signature:', signature);
            } catch (error: unknown) {
                // Ignore all errors; for now there is no API-compatible way to selectively ignore the expected
                // instruction error if the associated account exists already.
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Now this should always succeed
            account = await token.getAccount(connection, associatedToken, commitment, programId);
        } else {
            throw error;
        }
    }

  

    return account;
}

export async function mintTo(
    wallet: any, 
    destination: web3.PublicKey,
    authority: web3.Signer | web3.PublicKey,
    amount: number | bigint,
    multiSigners: web3.Signer[] = [],
    programId = TOKEN_2022_PROGRAM_ID
  ): Promise<web3.TransactionSignature> {
    function getSigners(
      signerOrMultisig: web3.Signer | web3.PublicKey,
      multiSigners: web3.Signer[]
    ): [web3.PublicKey, web3.Signer[]] {
      return signerOrMultisig instanceof web3.PublicKey
        ? [signerOrMultisig, multiSigners]
        : [signerOrMultisig.publicKey, [signerOrMultisig]];
    }
  
    const [authorityPublicKey, signers] = getSigners(authority, multiSigners);
  
    const mintToInstruction = token.createMintToInstruction(
      mint,
      destination,
      authorityPublicKey,
      amount,
      multiSigners,
      programId
    );
  
    const transaction = new web3.Transaction().add(mintToInstruction);
  
    transaction.feePayer = wallet.publicKey;
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
  
    if (signers.length > 0) {
      transaction.partialSign(...signers);
    }
  
    return await wallet.sendTransaction(transaction, connection);
  }
