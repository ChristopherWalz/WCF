<?php

namespace wcf\system\package\plugin;

use wcf\data\application\Application;

/**
 * Deletes templates installed with the `template` package installation plugin.
 *
 * @author  Matthias Schmidt
 * @copyright   2001-2021 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since   5.5
 */
final class TemplateDeletePackageInstallationPlugin extends AbstractTemplateDeletePackageInstallationPlugin
{
    /**
     * @inheritDoc
     */
    protected function getLogTableName(): string
    {
        return 'wcf1_template';
    }

    /**
     * @inheritDoc
     */
    protected function getFilePath(string $filename, string $application): string
    {
        return \sprintf(
            '%s/templates/%s.tpl',
            Application::getDirectory($application),
            $filename
        );
    }
}
