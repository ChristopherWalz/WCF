<?php

namespace wcf\system\user\authentication\password\algorithm;

use ParagonIE\ConstantTime\Hex;
use wcf\system\user\authentication\password\IPasswordAlgorithm;

/**
 * Implementation of the password algorithm for Drupal 8.x.
 *
 * @author  Tim Duesterhus
 * @copyright   2001-2022 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package WoltLabSuite\Core\System\User\Authentication\Password\Algorithm
 * @since   5.4
 */
final class Drupal8 implements IPasswordAlgorithm
{
    use TPhpass;

    private const COSTS = 15;

    /**
     * Returns the hashed password, with the given settings.
     */
    private function hashDrupal(
        #[\SensitiveParameter]
        string $password,
        string $settings
    ): string {
        $output = $this->hashPhpass($password, $settings);

        return \mb_substr($output, 0, 55, '8bit');
    }

    /**
     * @inheritDoc
     */
    public function verify(
        #[\SensitiveParameter]
        string $password,
        string $hash
    ): bool {
        // The passwords are stored differently when importing. Sometimes they are saved with the salt,
        // but sometimes also without the salt. We don't need the salt, because the salt is saved with the hash.
        [$hash] = \explode(':', $hash, 2);

        return \hash_equals($hash, $this->hashDrupal($password, $hash));
    }

    /**
     * @inheritDoc
     */
    public function hash(
        #[\SensitiveParameter]
        string $password
    ): string {
        $salt = Hex::encode(\random_bytes(4));

        return $this->hashDrupal($password, $this->getSettings() . $salt) . ':';
    }

    /**
     * @inheritDoc
     */
    public function needsRehash(string $hash): bool
    {
        return !\str_starts_with($hash, $this->getSettings());
    }

    /**
     * Returns the settings prefix with the algorithm identifier and costs.
     */
    private function getSettings(): string
    {
        return '$S$' . $this->itoa64[self::COSTS];
    }
}
