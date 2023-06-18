terraform {
    required_providers {
        google = {
            source = "hashicorp/google"
            version = "4.51.0"
        }
    }
}

provider "google" {
  credentials = file("/home/cynos/Downloads/k8s-b00930528-d57e2d1c1217.json")  
  project = "k8s-b00930528"
  region  = "us-central1"
  zone    = "us-central1-a"
}

resource "google_container_cluster" "my_cluster" {
  name               = "my-cluster"
  location           = "us-central1-a"
  initial_node_count = 1

  # Node Configuration
  node_config {
    # machine_type = "e2-micro"
    # disk_size_gb = 10

    # Image Type
    image_type = "COS_CONTAINERD"
  }

boot_disk {
    auto_delete  = true
    boot         = true
    disk_size_gb = 10
    disk_type    = "pd-standard"
  }
  
}

