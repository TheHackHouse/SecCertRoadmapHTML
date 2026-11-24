/* Taxonomy: domains, sub-domains (the columns), colours and level bands.
   Every entry's "cats" must use the sub-domain ids below. minCols is the starting width;
   the renderer widens a column automatically when it gets crowded. */
window.ROADMAP_DATA = window.ROADMAP_DATA || {};
window.ROADMAP_DATA.taxonomy = {
  "updated": "November 2026",
  "levels": {
    "count": 26,
    "note": "1 = most entry-level, 26 = most advanced",
    "bands": [
      {
        "name": "Expert",
        "from": 17,
        "to": 26
      },
      {
        "name": "Intermediate",
        "from": 5,
        "to": 16
      },
      {
        "name": "Beginner",
        "from": 1,
        "to": 4
      }
    ]
  },
  "charts": [
    {
      "id": "certifications",
      "tab": "Certifications",
      "title": "Security Certification Roadmap",
      "noun": "certifications",
      "note": ""
    },
    {
      "id": "training",
      "tab": "Training",
      "title": "Security Training Roadmap",
      "noun": "training courses",
      "note": "Reputable training that does not lead to an exam-based certification."
    },
    {
      "id": "retired",
      "tab": "Retired",
      "title": "Retired Security Certifications",
      "noun": "retired certifications",
      "note": "Certifications that can no longer be obtained, kept for reference."
    }
  ],
  "colors": {
    "green": [
      "#70AD47",
      "#548235",
      null
    ],
    "teal": [
      "#008080",
      "#003F3E",
      null
    ],
    "orange": [
      "#fa8e36",
      "#c06216",
      "#fdeada"
    ],
    "yellow": [
      "#e4ac03",
      "#7F6000",
      null
    ],
    "black": [
      "#2a2a2a",
      "#000000",
      "#d9d9d9"
    ],
    "purple": [
      "#683e9b",
      "#352647",
      "#eddbff"
    ],
    "skyblue": [
      "#6bb3f6",
      "#2665a0",
      null
    ],
    "blue": [
      "#2e5688",
      "#1f3147",
      "#dce6f2"
    ],
    "red": [
      "#c0514d",
      "#8c3736",
      "#f2dcdb"
    ]
  },
  "domains": [
    {
      "id": "network",
      "name": "Communication and Network Security",
      "color": "green",
      "description": "The communication and network security domain covers the ability to secure communication channels and networks. Topics include secure and converged protocols, wireless networks, cellular networks, hardware operation (warranty and redundant power) and third-party connectivity.  IP networking (IPSec, IPv4 and IPv6) are also included in this domain.",
      "subdomains": [
        {
          "id": "NET",
          "name": "",
          "minCols": 3
        }
      ]
    },
    {
      "id": "iam",
      "name": "IAM",
      "color": "teal",
      "description": "The identity and access management domain covers the attacks that target the human gateway to gain access to data. Other topics include ways to identify users with rights to access the information and servers. Identify and access management covers the topics of applications, Single sign-on authentication, privilege escalation, Kerberos, rule-based or risk-based access control, proofing and establishment of identity.",
      "subdomains": [
        {
          "id": "IAM",
          "name": "",
          "minCols": 1
        }
      ]
    },
    {
      "id": "engineer",
      "name": "Security Architecture and Engineering",
      "color": "orange",
      "description": "The security architecture and engineering domain covers important topics concering security engineering plans, designs, and principles. Topics include assessing and mitigating information system vulnerabilities, fundamental concepts of security models and security architectures in critical areas like access control. Cloud systems, cryptography, system infiltrations (ransomware, fault-injection and more) and virtualized systems are also covered in this domain.",
      "subdomains": [
        {
          "id": "ENG_CLOUD",
          "name": "Cloud / SysOps",
          "minCols": 4
        },
        {
          "id": "ENG_NIX",
          "name": "*nix",
          "minCols": 1
        },
        {
          "id": "ENG_ICS",
          "name": "ICS / IoT",
          "minCols": 1
        },
        {
          "id": "ENG_ARCH",
          "name": "Architecture",
          "minCols": 1
        }
      ]
    },
    {
      "id": "asset",
      "name": "Asset Security",
      "color": "yellow",
      "description": "The Asset Security domain deals with the issues related to the collection, storage, maintenance, retention and destruction of data. It also covers knowledge of different roles regarding data handling (owner, controller and custodian) as well as data protection methods and data states. Other topics include resource provision, asset classification and data lifecycle management.",
      "subdomains": [
        {
          "id": "ASSET",
          "name": "",
          "minCols": 2
        }
      ]
    },
    {
      "id": "mgmt",
      "name": "Security and Risk Management",
      "color": "black",
      "description": "The security and risk management domain covers general on skills related to the implementation of user awareness programs as well as security procedures. Emphasis is also placed on risk management concerning the acquisition of new services, hardware and software (supply chain). Other skills include social engineering defense mechanisms.",
      "subdomains": [
        {
          "id": "MGMT",
          "name": "Management",
          "minCols": 4
        },
        {
          "id": "GRC",
          "name": "GRC",
          "minCols": 5
        }
      ]
    },
    {
      "id": "testing",
      "name": "Security Assessment and Testing",
      "color": "purple",
      "description": "The security assessment and testing domain deals with all the techniques and tools used to find system vulnerabilities, weaknesses and potential areas of concern not addressed by security procedures and policies. Attack simulations, vulnerability assessment, compliance checks, and ethical disclosure also fall under this domain.",
      "subdomains": [
        {
          "id": "TEST",
          "name": "",
          "minCols": 3
        }
      ]
    },
    {
      "id": "software",
      "name": "Software Security",
      "color": "skyblue",
      "description": "The software development security domain deals with implementing software-based security protocols within environments for which the IT professional is responsible. Risk analysis, vulnerability identification and auditing of source codes are all covered in this subset. Additional topics include software-designed security, maturity models, development methodologies, open-source and third-party development security.",
      "subdomains": [
        {
          "id": "SW",
          "name": "",
          "minCols": 1
        }
      ]
    },
    {
      "id": "defops",
      "name": "Defensive Security Operations",
      "color": "blue",
      "description": "Defensive security operations: SOC analysis, detection and threat intelligence, forensics, incident handling, and the defensive, engineering and governance side of cloud and AI security.",
      "subdomains": [
        {
          "id": "SOC",
          "name": "SOC / Threat Intel",
          "minCols": 2
        },
        {
          "id": "DEF_CLOUDAI",
          "name": "Cloud / AI",
          "minCols": 2
        },
        {
          "id": "MAL",
          "name": "Malware / RE",
          "minCols": 2
        },
        {
          "id": "FOR",
          "name": "Forensics",
          "minCols": 2
        },
        {
          "id": "IH",
          "name": "Incident Handling",
          "minCols": 2
        }
      ]
    },
    {
      "id": "offops",
      "name": "Offensive Security Operations",
      "color": "red",
      "description": "Offensive security operations: penetration testing, red teaming, exploitation and reverse engineering, plus offensive cloud, AI and physical security.",
      "subdomains": [
        {
          "id": "PEN",
          "name": "Penetration Testing",
          "minCols": 7
        },
        {
          "id": "EXP",
          "name": "Exploitation / RE / Hardware",
          "minCols": 2
        },
        {
          "id": "OFF_CLOUD",
          "name": "Cloud",
          "minCols": 3
        },
        {
          "id": "OFF_AI",
          "name": "AI",
          "minCols": 2
        },
        {
          "id": "PHY",
          "name": "Physical",
          "minCols": 1
        }
      ]
    }
  ]
};
