// src/config.ts
export const serverConfig = {
  blockedCommands: new Set<string>(),
};

export function setBlockedCommands(commands: string) {
  if (commands) {
    const commandList = commands.split(',').map(cmd => cmd.trim().toUpperCase());
    serverConfig.blockedCommands = new Set(commandList);
  }
}
