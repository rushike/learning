resource "google_storage_bucket" "my_github_bucket" {
  name                        = "hack-team-phoenix_tfc_bucket"
  location                    = "EU"
  force_destroy               = true
  public_access_prevention    = "enforced"
  uniform_bucket_level_access = true
}