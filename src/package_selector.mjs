import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import os from 'os';
import path from 'path';
import { getAppDir } from './dirname.mjs';

export async function selectPackages() {
    const packagesJson = fs.readFileSync(path.join(getAppDir(), 'packageData.json'), 'utf8');
    const packagesData = JSON.parse(packagesJson);

    const currentOS = os.platform() === 'win32' ? 'windows' : os.platform() === 'darwin' ? 'mac' : 'linux';

    const choices = Object.entries(packagesData).flatMap(([category, packages]) => [
        new inquirer.Separator(chalk.red(`-- ${category} --`)),
        ...Object.entries(packages)
            .filter(([_, packageDetails]) => packageDetails.install[currentOS] !== '')
            .map(([packageName, packageDetails]) => {
                let choiceName = packageName;
                if (packageDetails.description) {
                    choiceName += ` - ${packageDetails.description}`;
                }

                if (packageDetails.type === 'force') {
                    return {
                        name: choiceName,
                        checked: true,
                        disabled: chalk.yellow('Forced installation'), // This will disable the option to deselect
                    };
                }

                return {
                    name: choiceName,
                    checked: packageDetails.type === 'enable',
                };
            }),
    ]);

    try {
        const answers = await inquirer.prompt([
            {
                type: 'checkbox',
                message: 'Select packages to install',
                name: 'selectedPackages',
                choices: choices,
                pageSize: 15,
            },
        ]);

        const forcedPackages = Object.entries(packagesData).flatMap(([category, packages]) =>
            Object.entries(packages)
                .filter(([_, packageDetails]) => packageDetails.type === 'force' && packageDetails.install[currentOS] !== '')
                .map(([packageName, _]) => packageName)
        );

        // Remove the description from the selected packages
        const cleanedSelectedPackages = answers.selectedPackages.map((packageName) => packageName.replace(/ - .*/, ''));

        const selectedPackages = [...forcedPackages, ...cleanedSelectedPackages];

        return selectedPackages
            .map((packageName) => {
                for (const category in packagesData) {
                    if (packagesData[category][packageName]) {
                        const packageDetails = packagesData[category][packageName];
                        return {
                            packageName,
                            installCommand: packageDetails.install[currentOS],
                        };
                    }
                }
                return null;
            })
            .filter((pkg) => pkg !== null);
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}
